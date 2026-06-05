package com.example.demo.service;

import com.example.demo.dto.answer.AnswerRequest;
import com.example.demo.dto.answer.AnswerResponse;
import com.example.demo.entity.Answer;
import com.example.demo.repository.AnswerRepository;
import com.example.demo.repository.QuestionRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.exception.BusinessException;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AnswerService {

	private final AnswerRepository answerRepository;
	private final QuestionRepository questionRepository;
	private final UserRepository userRepository;

	public AnswerService(AnswerRepository answerRepository,
			QuestionRepository questionRepository,
			UserRepository userRepository) {
		this.answerRepository = answerRepository;
		this.questionRepository = questionRepository;
		this.userRepository = userRepository;
	}

	// DTO入力 → DTO出力
	@Transactional
	public AnswerResponse createAnswer(AnswerRequest request, Integer userId) {

		Answer answer = new Answer();

		answer.setAnswerContent(request.getAnswerContent());

		answer.setQuestion(
				questionRepository.findById(request.getQuestionId())
						.orElseThrow(() -> new BusinessException("問題が見つかりません")));

		answer.setUser(
				userRepository.findById(userId)
						.orElseThrow(() -> new BusinessException("ユーザーが見つかりません")));

		answer.setSubmittedAt(LocalDateTime.now());

		Answer saved = answerRepository.save(answer);

		return toResponse(saved);
	}

	@Transactional
	public AnswerResponse updateAnswer(Integer id, AnswerRequest request) {

		Answer answer = answerRepository.findById(id)
				.orElseThrow(() -> new BusinessException("回答が見つかりません"));

		answer.setAnswerContent(request.getAnswerContent());

		Answer saved = answerRepository.save(answer);

		return toResponse(saved);
	}

	@Transactional(readOnly = true)
	public List<AnswerResponse> getMyAnswers(Integer userId) {
		return answerRepository.findByUser_UserId(userId)
				.stream()
				.map(this::toResponse)
				.toList();
	}

	@Transactional(readOnly = true)
	public List<AnswerResponse> getAnswersByQuestion(Integer questionId) {
		return answerRepository.findByQuestion_QuestionId(questionId)
				.stream()
				.map(this::toResponse)
				.toList();
	}

	private AnswerResponse toResponse(Answer answer) {
		AnswerResponse res = new AnswerResponse();
		res.setAnswerId(answer.getAnswerId());
		res.setAnswerContent(answer.getAnswerContent());
		res.setQuestionId(answer.getQuestion().getQuestionId());
		res.setUserId(answer.getUser().getUserId());
		res.setSubmittedAt(answer.getSubmittedAt());
		res.setUserName(answer.getUser().getName());
		return res;
	}

	// 💡 クラスの閉じカッコ（}）の内側に正しく配置しました
	@Transactional
	public AnswerResponse upsertAnswer(AnswerRequest request, Integer userId) {
		return answerRepository
				.findFirstByUser_UserIdAndQuestion_QuestionIdOrderByAnswerIdDesc(userId, request.getQuestionId())
				.map(existingAnswer -> {
					// 【更新ルート】
					existingAnswer.setAnswerContent(request.getAnswerContent());
					existingAnswer.setSubmittedAt(LocalDateTime.now());
					Answer saved = answerRepository.save(existingAnswer);
					return toResponse(saved);
				})
				.orElseGet(() -> {
					// 【新規ルート】
					return createAnswer(request, userId);
				});
	}
}